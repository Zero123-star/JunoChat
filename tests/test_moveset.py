from game.moveset import Moveset
from game.ability import Ability

def create_test_abilities():
    return [
        Ability("Slash", "A quick slash", "Melee", 10, 0),
        Ability("Block", "Defensive stance", "Defense", 0, 0),
        Ability("Fireball", "A ball of fire", "Magic", 20, 5)
    ]

def test_moveset_initialization():
    abilities = create_test_abilities()
    moveset = Moveset(abilities)
    assert len(moveset.abilities) == 3
    assert moveset.abilities[0].name == "Slash"
    assert moveset.abilities[1].name == "Block"
    assert moveset.abilities[2].name == "Fireball"

def test_moveset_add_ability():
    moveset = Moveset([])
    ability = Ability("Slash", "A quick slash", "Melee", 10, 0)
    moveset.add_ability(ability)
    assert len(moveset.abilities) == 1
    assert moveset.abilities[0] == ability

def test_moveset_remove_ability():
    abilities = create_test_abilities()
    moveset = Moveset(abilities)
    moveset.remove_ability("Block")
    assert len(moveset.abilities) == 2
    assert all(a.name != "Block" for a in moveset.abilities)

def test_moveset_get_ability():
    abilities = create_test_abilities()
    moveset = Moveset(abilities)
    ability_tuple = moveset.get_ability("Fireball")
    assert ability_tuple is not None
    ability_type, ability_power, ability_cost = ability_tuple
    assert ability_type == "Magic"
    assert ability_power == 20
    assert ability_cost == 5
    assert moveset.get_ability("Nonexistent") == 0

def test_moveset_list_abilities():
    abilities = create_test_abilities()
    moveset = Moveset(abilities)
    names = moveset.list_abilities()
    assert "Slash" in names
    assert "Block" in names
    assert "Fireball" in names
    assert len(names) == 3

def test_moveset_repr_and_str():
    abilities = create_test_abilities()
    moveset = Moveset(abilities)
    r = repr(moveset)
    s = str(moveset)
    assert isinstance(r, str)
    assert isinstance(s, str)
    assert "Moveset" in r or "Moveset" in s

def run_all_tests():
    test_functions = [
        test_moveset_initialization,
        test_moveset_add_ability,
        test_moveset_remove_ability,
        test_moveset_get_ability,
        test_moveset_list_abilities,
        test_moveset_repr_and_str
    ]
    for test in test_functions:
        try:
            test()
            print(f"✓ {test.__name__} passed")
        except AssertionError as e:
            print(f"✗ {test.__name__} failed: {str(e)}")
        except Exception as e:
            print(f"✗ {test.__name__} failed with error: {str(e)}")

if __name__ == "__main__":
    run_all_tests()
    
# python -m tests.test_moveset