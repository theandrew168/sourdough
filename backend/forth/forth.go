package forth

import (
	"fmt"
	"strconv"
)

type Forth struct {
	s *Stack
}

func New() *Forth {
	f := Forth{
		s: NewStack(2048),
	}
	return &f
}

func (f *Forth) Interpret(source string) error {
	words := Lex(source)
	for _, word := range words {
		switch word {
		case "+":
			a, err := f.s.Pop()
			if err != nil {
				return err
			}

			b, err := f.s.Pop()
			if err != nil {
				return err
			}

			c := a + b

			err = f.s.Push(c)
			if err != nil {
				return err
			}
		case "*":
			a, err := f.s.Pop()
			if err != nil {
				return err
			}

			b, err := f.s.Pop()
			if err != nil {
				return err
			}

			c := a * b

			err = f.s.Push(c)
			if err != nil {
				return err
			}
		case ".":
			i, err := f.s.Pop()
			if err != nil {
				return err
			}
			fmt.Println(i)
		default:
			i, err := strconv.Atoi(word)
			if err != nil {
				return err
			}

			f.s.Push(int32(i))
		}
	}

	return nil
}
