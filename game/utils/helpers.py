import random

def roll_die(sides: int = 6) -> int:
    return random.randint(1, sides)

def clamp(value: int, min_value: int, max_value: int) -> int:
    return max(min(value, max_value), min_value)