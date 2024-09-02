package todo

import (
    "testing"
    "os"
    "fmt"
)

// fail if adding a todo doesn't create todo.md
func TestAddFirstTodo(t *testing.T) {
    msg, err := Add("buy oatmilk")

    if err != nil {
        t.Fatalf(`Error in Add. message: %q, error: %v`, msg, err)
    }

    fileExist := false
    if _, err := os.Stat("todo.md"); err == nil {
      fileExist = true
    }

    if !fileExist  {
        t.Fatalf("todo.md doesn't exist")
    }

    dat, err := os.ReadFile("todo.md")
    if err != nil {
        t.Fatalf("error reading file")
    }

    want := "buy milk"
    actual := string(dat)

    if actual != want  {
        t.Fatalf("todo.md has '%s', instead of '%s'.", actual, want)
    }

    fmt.Print(string(dat))
}
