package forth

import (
	"errors"
	"strconv"
	"strings"
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

func (s *Stack) String() string {
	var data []string
	for i := 0; i < s.idx; i++ {
		d := int(s.buf[i])
		data = append(data, strconv.Itoa(d))
	}

	return strings.Join(data, " ")
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
