package main

import (
    "fmt"

    "github.com/oren/todo"
)

func main() {
    // Get a greeting message and print it.
    message := todo.Add("buy milk")
    fmt.Println(message)
}
