package main

import (
	"context"
	"fmt"
	"log"
	"math"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Book struct {
	ID primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
 	Completed bool `json:"completed"`
    Body string `json:"body"`
	Pages     int                `json:"pages"`    
	ReadPages int                `json:"readpages"`
	Percentage float64           `json:"percentage"`
}

var collection *mongo.Collection

func main() {
	if os.Getenv("ENV") != "production" {
		err := godotenv.Load(".env")
		if err != nil {
			log.Fatal("Error loading .env file:", err)
		}
	}

	MONGO_URI := os.Getenv("MONGO_URI")
	clientOptions := options.Client().ApplyURI(MONGO_URI)
	client,err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(),nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")

	collection = client.Database("golang_db").Collection("books")

	app := fiber.New()

	
	app.Get("/api/books", getBooks)
	app.Post("/api/books", createBook)
	app.Patch("/api/books/:id", updateBook)
	app.Patch("/api/books/:id/read", updateReadPages)
	app.Delete("/api/books/:id", removeBook)

    port := os.Getenv("PORT")
    if port == "" {
	port = "4000"
    }

	if os.Getenv("ENV") == "production" {
		app.Static("/", "./frontend/build")
	}

    app.Listen("0.0.0.0:" + port)
}

func getBooks(c *fiber.Ctx) error {
	status := c.Query("status")
	filter := bson.M{}

	if status == "completed" {
		filter["completed"] = true
	} else if status == "inprogress" {
		filter["completed"] = false
	}

	var books []Book

	cursor,err := collection.Find(context.Background(),filter)

	if err != nil {
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()){
		var book Book
		if err := cursor.Decode(&book); err != nil {
			return err
		}
		books = append(books,book)
	}
	return c.JSON(books)
}

 func createBook(c *fiber.Ctx) error {
	book := new(Book)

	if err := c.BodyParser(book); err != nil {
    return err
	}

	if book.Body == "" {
     return c.Status(400).JSON(fiber.Map{"error": "Book title cannot be empty"})
	}

	if book.Pages <= 0 {
		return c.Status(400).JSON(fiber.Map{"error": "Book pages cannot be empty"})
	   }

	insertResult, err := collection.InsertOne(context.Background(), book)
	if err != nil {
		return err
	}

	book.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(201).JSON(book)
 }



func updateBook(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID,err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error":"Invalid Book id"})
	}

	book := new(Book)
	err = collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(book)
	if err != nil {
		return err
	}

	update := bson.M{
		"$set": bson.M{
			"completed":  true,
			"readpages":  book.Pages,
			"percentage": 100.0,
		},
	}

	_, err = collection.UpdateOne(context.Background(), bson.M{"_id": objectID}, update)
	if err != nil {
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success":true})
}

func updateReadPages(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid Book id"})
	}

	var data struct {
		ReadPages int `json:"readpages"`
	}

	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	book := new(Book)
	err = collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(book)
	if err != nil {
		return err
	}

	percentage := math.Round(float64(data.ReadPages) / float64(book.Pages) * 1000) / 10
	
	completed := data.ReadPages == book.Pages

	update := bson.M{
		"$set": bson.M{
			"readpages":  data.ReadPages,
			"percentage": percentage,
			"completed":  completed,
		},
	}

	_, err = collection.UpdateOne(context.Background(), bson.M{"_id": objectID}, update)
	if err != nil {
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success": true, "percentage": percentage})
}



func removeBook(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID,err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid Book ID"})
	}

	filter := bson.M{"_id": objectID}
	_, err = collection.DeleteOne(context.Background(),filter)

	if err != nil {
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success":true})
} 


 