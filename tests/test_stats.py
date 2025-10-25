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
    stats.add_temporary("Strength", {"Value": 3, "Turns": 2})
    assert stats.get_temporary("Strength") == 3
    
def test_increase_permanent():
    stats = Stats({"Strength": 2})
    stats.increase_permanent("Strength", 3)
    assert stats.get_permanent("Strength") == 5

def test_decrease_duration():
    stats = Stats({"Strength": 2}, {"Strength": [{"Value": 3, "Turns": 1}, {"Value": 5, "Turns": 2}]})
    stats.decrease_duration()
    assert stats.temporaries == {"Strength": [{"Value": 5, "Turns": 1}]}
    
    

