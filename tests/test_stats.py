from game.statsheet import Statsheet
from game.stats import Stats

def test_get_permanent():
    stats = Statsheet({Stats.STRENGTH: 2, Stats.CONSTITUTION: 4})
    assert stats.get_permanent(Stats.STRENGTH) == 2
    assert stats.get_permanent(Stats.DEXTERITY) == 0

def test_get_temporary():
    stats = Statsheet({Stats.STRENGTH: 2}, {Stats.STRENGTH: [{"Value": 3, "Turns": 2}, {"Value": 5, "Turns": 1}]})
    assert stats.get_temporary(Stats.STRENGTH) == 8
    assert stats.get_temporary(Stats.DEXTERITY) == 0

def test_add_temporary():
    stats = Statsheet({Stats.STRENGTH: 2})
    stats.add_temporary(Stats.STRENGTH, value=3, turns=2)
    assert stats.get_temporary(Stats.STRENGTH) == 3

def test_update_permanent():
    stats = Statsheet({Stats.STRENGTH: 2})
    stats.update_permanent(Stats.STRENGTH, 3)
    assert stats.get_permanent(Stats.STRENGTH) == 5

def test_update_duration():
    stats = Statsheet(
        {Stats.STRENGTH: 2},
        {Stats.STRENGTH: [
            {"Value": 3, "Turns": 1, "Source": "Strength Potion"},
            {"Value": 5, "Turns": 2, "Source": "Greater Strength Potion"}
        ]}
    )
    stats.update_duration()
    assert stats.temporary_stats == {Stats.STRENGTH: [{"Value": 5, "Turns": 1, "Source": "Greater Strength Potion"}]}

def run_all_tests():
    test_functions = [
        test_add_temporary,
        test_get_temporary,
        test_get_permanent,
        test_update_permanent,
        test_update_duration
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

#python -m tests.test_stats