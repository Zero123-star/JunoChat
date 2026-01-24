from game.npc import *
from game.item_types import ItemType as it, ItemSubType as ist
def test_npc_initialization():
    inventory = Inventory([Item("Sword", it.WEAPON, ist.WeaponType.SWORD, slot="Hand"), Item("Shield", it.WEAPON, ist.WeaponType.SHIELD, slot="Hand")])
    moveset = Moveset([Ability("Slash", "", "Melee", 50, 0), Ability("Block", "", "Defense", 0, 0)])
    stats = Statsheet({Stats.STRENGTH: 2, Stats.CONSTITUTION: 4, Stats.DEXTERITY: 1})
    npc = NPC(100, 50, 40, inventory, moveset, stats)
    
    assert npc.get_health() == 100
    assert npc.get_mana() == 50
    assert npc.get_stamina() == 40
    assert npc.get_stats().get_permanent(Stats.STRENGTH) == 2
    assert npc.get_stats().get_permanent(Stats.CONSTITUTION) == 4
    assert npc.get_stats().get_permanent(Stats.DEXTERITY) == 1
    
def test_npc_stat_modification():
    inventory = Inventory([Item("Sword", it.WEAPON, ist.WeaponType.SWORD, slot="Hand"), Item("Shield", it.WEAPON, ist.WeaponType.SHIELD, slot="Hand")])
    moveset = Moveset([Ability("Slash", "", "Melee", 50, 0), Ability("Block", "", "Defense", 0, 0)])
    stats = Statsheet({Stats.STRENGTH: 2, Stats.CONSTITUTION: 4})
    npc = NPC(100, 50, 40, inventory, moveset, stats)
    
    npc.change_health(-10)
    assert npc.get_health() == 90
    
    npc.change_mana(20)
    assert npc.get_mana() == 70
    
    npc.change_stamina(-5)
    assert npc.get_stamina() == 35
    
    npc.get_stats().update_permanent(Stats.STRENGTH, 3)
    assert npc.get_stats().get_permanent(Stats.STRENGTH) == 5
    
def test_npc_temporary_stats():
    inventory = Inventory([Item("Sword", it.WEAPON, ist.WeaponType.SWORD, slot="Hand"), Item("Shield", it.WEAPON, ist.WeaponType.SHIELD, slot="Hand")])
    moveset = Moveset([Ability("Slash", "", "Melee", 50, 0), Ability("Block", "", "Defense", 0, 0)])
    stats = Statsheet({Stats.STRENGTH: 2})
    npc = NPC(100, 50, 40, inventory, moveset, stats)
    
    npc.get_stats().add_temporary(Stats.STRENGTH, value=3, turns=2, source="Weaker Strength Potion")
    assert npc.get_stats().get_temporary(Stats.STRENGTH) == 3
    
    npc.get_stats().update_duration()
    assert dict(npc.get_stats().temporary_stats) == {Stats.STRENGTH: [{"Value": 3, "Turns": 1, "Source": "Weaker Strength Potion"}]}
    
    npc.get_stats().update_duration()
    assert dict(npc.get_stats().temporary_stats) == {}
    
def test_npc_unique_id():
    stats1 = Statsheet({Stats.STRENGTH: 2})
    npc1 = NPC(100, 50, 40, None, None, stats1)
    
    stats2 = Statsheet({Stats.CONSTITUTION: 4})
    npc2 = NPC(120, 60, 50, None, None, stats2)
    
    assert npc1.get_id() != npc2.get_id()
    assert npc2.get_id() == npc1.get_id() + 1
    
def test_npc_stat_retrieval():
    inventory = Inventory([Item("Sword", it.WEAPON, ist.WeaponType.SWORD, slot="Hand"), Item("Shield", it.WEAPON, ist.WeaponType.SHIELD, slot="Hand")])
    moveset = Moveset([Ability("Slash", "", "Melee", 50, 0), Ability("Block", "", "Defense", 0, 0)])
    stats = Statsheet({Stats.STRENGTH: 2, Stats.CONSTITUTION: 4, Stats.DEXTERITY: 1})
    npc = NPC(100, 50, 40, inventory, moveset, stats)
    
    retrieved_stats = npc.get_stats()
    assert retrieved_stats.get_permanent(Stats.STRENGTH) == 2
    assert retrieved_stats.get_permanent(Stats.CONSTITUTION) == 4
    assert retrieved_stats.get_permanent(Stats.DEXTERITY) == 1
    assert retrieved_stats.get_temporary(Stats.STRENGTH) == 0
    retrieved_stats.add_temporary(Stats.STRENGTH, value=5, turns=3)
    assert retrieved_stats.get_temporary(Stats.STRENGTH) == 5
    retrieved_stats.update_duration()
    assert retrieved_stats.get_temporary(Stats.STRENGTH) == 5
    retrieved_stats.update_duration()
    retrieved_stats.update_duration()
    assert retrieved_stats.get_temporary(Stats.STRENGTH) == 0
''' 
def run_all_tests():
    test_functions = [
        test_npc_initialization,
        test_npc_stat_modification,
        test_npc_stat_retrieval,
        test_npc_temporary_stats,
        test_npc_unique_id
    ]
'''
def auxi():
    inventory = Inventory()
    inventory2=Inventory([Item("Sword", it.WEAPON, ist.WeaponType.SWORD, slot="Hand"), Item("Shield", it.WEAPON, ist.WeaponType.SHIELD, slot="Hand")])
    moveset = Moveset([Ability("Slash", "", "Melee", 50, 0), Ability("Block", "", "Defense", 0, 0)])
    stats = Statsheet({Stats.STRENGTH: 2, Stats.CONSTITUTION: 4, Stats.DEXTERITY: 1})
    npc = NPC(100, 50, 40, inventory, moveset, stats)
    Items=[Item("Sword", it.WEAPON, ist.WeaponType.SWORD, slot="Left_Hand"), Item("Shield", it.WEAPON, ist.WeaponType.SHIELD, slot="Right_Hand")]
    retrieved_stats = npc.get_stats()
    for i in Items:
        npc.get_inventory().add_item(i)
    print(inventory.items)
    print(inventory2.capacity)
    npc.get_inventory().equip_item(inventory.items[0])    
    #for name in npc.get_inventory().list_items:
    #    print(name)
if __name__ == "__main__":
    auxi()
# python -m tests.test_npc