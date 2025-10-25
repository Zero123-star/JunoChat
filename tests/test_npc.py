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
    
    npc.get_stats().increase_permanent("Strength", 3)
    assert npc.get_stats().get_permanent("Strength") == 5
    
def test_npc_temporary_stats():
    stats = Stats({"Strength": 2})
    npc = NPC(100, 50, 40, stats)
    
    npc.get_stats().add_temporary("Strength", {"Value": 3, "Turns": 2})
    assert npc.get_stats().get_temporary("Strength") == 3
    
    npc.get_stats().decrease_duration()
    assert npc.get_stats().temporaries == {"Strength": [{"Value": 3, "Turns": 1}]}
    
    npc.get_stats().decrease_duration()
    assert npc.get_stats().temporaries == {}
    
def test_npc_unique_id():
    stats1 = Stats({"Strength": 2})
    npc1 = NPC(100, 50, 40, stats1)
    
    stats2 = Stats({"Constitution": 4})
    npc2 = NPC(120, 60, 50, stats2)
    
    assert npc1.get_id() != npc2.get_id()
    assert npc2.get_id() == npc1.get_id() + 1
    
def test_npc_stat_retrieval():
    stats = Stats({"Strength": 2, "Constitution": 4})
    npc = NPC(100, 50, 40, stats)
    
    retrieved_stats = npc.get_stats()
    assert retrieved_stats.get_permanent("Strength") == 2
    assert retrieved_stats.get_permanent("Constitution") == 4
    assert retrieved_stats.get_permanent("Dexterity") == 1
    assert retrieved_stats.get_temporary("Strength") == 0
    retrieved_stats.add_temporary("Strength", {"Value": 5, "Turns": 3})
    assert retrieved_stats.get_temporary("Strength") == 5
    retrieved_stats.decrease_duration()
    assert retrieved_stats.get_temporary("Strength") == 5
    retrieved_stats.decrease_duration()
    retrieved_stats.decrease_duration()
    assert retrieved_stats.get_temporary("Strength") == 0
    