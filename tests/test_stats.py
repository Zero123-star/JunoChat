from game.stats import Stats

def test_get_permanent():
    stats = Stats({"Strength": 2, "Constitution": 4})
    assert stats.get_permanent("Strength") == 2
    assert stats.get_permanent("Dexterity") == 0
    
def test_get_temporary():
    stats = Stats({"Strength": 2}, {"Strength": [{"Value": 3, "Turns": 2}, {"Value": 5, "Turns": 1}]})
    assert stats.get_temporary("Strength") == 8
    assert stats.get_temporary("Dexterity") == 0
    
def test_add_temporary():
    stats = Stats({"Strength": 2})
    stats.add_temporary("Strength", value=3, turns=2)
    assert stats.get_temporary("Strength") == 3
    
def test_update_permanent():
    stats = Stats({"Strength": 2})
    stats.update_permanent("Strength", 3)
    assert stats.get_permanent("Strength") == 5

def test_update_duration():
    stats = Stats({"Strength": 2, "Source" : "Strength Totem"}, {"Strength": [{"Value": 3, "Turns": 1, "Source" : "Strength Potion"}, {"Value": 5, "Turns": 2, "Source": "Greater Strength Potion"}]})
    stats.update_duration()
    assert stats.temporaries == {"Strength": [{"Value": 5, "Turns": 1, "Source" : "Greater Strength Potion"}]}
    
    
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