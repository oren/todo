package main

import (
    "fmt"
    "log"

    "github.com/oren/todo"
)

func main() {
    // Get a todo and print it.

    log.SetPrefix("todo: ")
    log.SetFlags(0)

    message, err := todo.Add("buy milk")

    if err != nil {
        log.Fatal(err)
    }

    fmt.Println(message)

    message, err = todo.Add("")

    if err != nil {
        log.Fatal(err)
    }

    fmt.Println(message)
}
