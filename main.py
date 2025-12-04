from game.stats import Stats
from game.statsheet import Statsheet
from game.npc import NPC
from game.inventory import Inventory
from game.moveset import Moveset
from game.ability import Ability

def main():
    inventory = Inventory()
    moveset = Moveset([
        Ability("Slash", "", "Melee", 10, 0)
    ])
    stats = Statsheet({Stats.STRENGTH: 2, Stats.CONSTITUTION: 4, Stats.DEXTERITY: 1})
    npc = NPC(100, 50, 40, inventory, moveset, stats)

    print("Initial HP:", npc.get_health())
    npc.change_health(-10)
    print("After damage:", npc.get_health())

    stats.add_temporary(Stats.STRENGTH, value=3, turns=2)
    print("Temporary Strength:", stats.get_temporary(Stats.STRENGTH))

    stats.update_duration()
    print("After 1 turn:", dict(stats.temporaries))

if __name__ == "__main__":
    main()