'''from game.stats import Stats
from game.statsheet import Statsheet
from game.npc import NPC
from game.inventory import Inventory
from game.moveset import Moveset
from game.ability import Ability
from game.item import Item'''
from game import *
def main():
 
    inventory = Inventory()
    moveset = Moveset([
        Ability("Slash", formulas.cleave_damage)
    ])
    stats = Statsheet({"STRENGTH": 2, "CONSTITUTION": 4, "DEXTERITY": 1})
    npc = NPC(100, 50, 40, inventory, moveset, stats)
    print(npc.get_moveset().get_ability(name="Slash").get_damage(npc.get_stats()))
    ''' 
    item_stats=({"Type": "STRENGTH", "Value" : 5, "Turns" : None},{"Type": "DEXTERITY", "Value" : 5, "Turns" : 5},{"Type": "ATTACK", "Value" : 5, "Turns" : None})
    item = Item(name="Item101",type="Weapon",slot="Left_Hand",stats=item_stats)
    npc.get_inventory().add_item(item)
    print(npc.get_stats().get_permanent("WISDOM"))
    #for i in npc.get_stats().permanent_stats:
    #    print(i)

    npc.equip(item)
    stats=npc.get_stats()
    list=stats.temporary_stats["STRENGTH"]
    name="DEXTERITY"
    #print(npc.get_stats().get_temporary(name))
    print(npc.get_stats().get_permanent(name)+npc.get_stats().get_temporary(name))
    for i in list:
        print(i)
    for i in range(100):
        npc.get_stats().update_duration()
    print(npc.get_stats().get_permanent(name)+npc.get_stats().get_temporary(name))
    print(npc.get_stats().get_permanent("STRENGTH")+npc.get_stats().get_temporary("STRENGTH"))
    npc.unequip("Left_Hand")
    print(npc.get_stats().get_permanent("STRENGTH")+npc.get_stats().get_temporary("STRENGTH"))
'''
if __name__ == "__main__":
    main()