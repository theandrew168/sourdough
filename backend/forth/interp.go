package forth

import (
	"fmt"
	"strconv"
)

func Interpret(words []string) error {
	s := NewStack(2048)
	for _, word := range words {
		switch word {
		case "+":
			a, err := s.Pop()
			if err != nil {
				return err
			}

			b, err := s.Pop()
			if err != nil {
				return err
			}

			c := a + b

			err = s.Push(c)
			if err != nil {
				return err
			}
		case "*":
			a, err := s.Pop()
			if err != nil {
				return err
			}

			b, err := s.Pop()
			if err != nil {
				return err
			}

			c := a * b

			err = s.Push(c)
			if err != nil {
				return err
			}
		case ".":
			i, err := s.Pop()
			if err != nil {
				return err
			}
			fmt.Println(i)
		default:
			i, err := strconv.Atoi(word)
			if err != nil {
				return err
			}

			s.Push(int32(i))
		}
	}

	return nil
}
