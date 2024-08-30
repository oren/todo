package todo

import (
    "testing"
    "regexp"
)

// TestHelloName calls greetings.Hello with a name, checking
// for a valid return value.
func TestAddTodo(t *testing.T) {
    todo := "buy oatmilk"
    want := regexp.MustCompile(`\b`+todo+`\b`)
    msg, err := Add("buy oatmilk")
    if !want.MatchString(msg) || err != nil {
        t.Fatalf(`Add("buy oatmilk") = %q, %v, want match for %#q, nil`, msg, err, want)
    }
}

// TestHelloEmpty calls greetings.Hello with an empty string,
// checking for an error.
func TestAddEmpty(t *testing.T) {
    msg, err := Add("")
    if msg != "" || err == nil {
        t.Fatalf(`Add("") = %q, %v, want "", error`, msg, err)
    }
}
