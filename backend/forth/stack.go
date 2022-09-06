package forth

import (
	"errors"
)

var (
	ErrStackEmpty = errors.New("forth: stack empty")
	ErrStackFull  = errors.New("forth: stack full")
)

type Stack struct {
	idx int
	buf []int32
}

func NewStack(size int) *Stack {
	s := Stack{
		idx: 0,
		buf: make([]int32, size),
	}
	return &s
}

func (s *Stack) Push(e int32) error {
	if s.idx >= cap(s.buf) {
		return ErrStackFull
	}

	s.buf[s.idx] = e
	s.idx += 1
	return nil
}

func (s *Stack) Pop() (int32, error) {
	if s.idx <= 0 {
		return 0, ErrStackEmpty
	}

	s.idx -= 1
	return s.buf[s.idx], nil
}
