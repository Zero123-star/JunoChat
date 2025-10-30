from game.npc import NPC
from game.stats import Stats

def test_npc_initialization():
    stats = Stats({"Strength": 2, "Constitution": 4, "Dexterity": 1})
    npc = NPC(100, 50, 40, stats)
    
    assert npc.get_health() == 100
    assert npc.get_mana() == 50
    assert npc.get_stamina() == 40
    assert npc.get_stats().get_permanent("Strength") == 2
    assert npc.get_stats().get_permanent("Constitution") == 4
    assert npc.get_stats().get_permanent("Dexterity") == 1
    
def test_npc_stat_modification():
    stats = Stats({"Strength": 2, "Constitution": 4})
    npc = NPC(100, 50, 40, stats)
    
    npc.change_health(-10)
    assert npc.get_health() == 90
    
    npc.change_mana(20)
    assert npc.get_mana() == 70
    
    npc.change_stamina(-5)
    assert npc.get_stamina() == 35
    
    npc.get_stats().update_permanent("Strength", 3)
    assert npc.get_stats().get_permanent("Strength") == 5
    
def test_npc_temporary_stats():
    stats = Stats({"Strength": 2})
    npc = NPC(100, 50, 40, stats)
    
    npc.get_stats().add_temporary("Strength", value=3, turns=2, source="Weaker Strength Potion")
    assert npc.get_stats().get_temporary("Strength") == 3
    
    npc.get_stats().update_duration()
    assert dict(npc.get_stats().temporaries) == {"Strength": [{"Value": 3, "Turns": 1, "Source": "Weaker Strength Potion"}]}
    
    npc.get_stats().update_duration()
    assert dict(npc.get_stats().temporaries) == {}
    
def test_npc_unique_id():
    stats1 = Stats({"Strength": 2})
    npc1 = NPC(100, 50, 40, stats1)
    
    stats2 = Stats({"Constitution": 4})
    npc2 = NPC(120, 60, 50, stats2)
    
    assert npc1.get_id() != npc2.get_id()
    assert npc2.get_id() == npc1.get_id() + 1
    
def test_npc_stat_retrieval():
    stats = Stats({"Strength": 2, "Constitution": 4, "Dexterity": 1})
    npc = NPC(100, 50, 40, stats)
    
    retrieved_stats = npc.get_stats()
    assert retrieved_stats.get_permanent("Strength") == 2
    assert retrieved_stats.get_permanent("Constitution") == 4
    assert retrieved_stats.get_permanent("Dexterity") == 1
    assert retrieved_stats.get_temporary("Strength") == 0
    retrieved_stats.add_temporary("Strength", value=5, turns=3)
    assert retrieved_stats.get_temporary("Strength") == 5
    retrieved_stats.update_duration()
    assert retrieved_stats.get_temporary("Strength") == 5
    retrieved_stats.update_duration()
    retrieved_stats.update_duration()
    assert retrieved_stats.get_temporary("Strength") == 0
    
def run_all_tests():
    test_functions = [
        test_npc_initialization,
        test_npc_stat_modification,
        test_npc_stat_retrieval,
        test_npc_temporary_stats,
        test_npc_unique_id
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

# python -m tests.test_npc