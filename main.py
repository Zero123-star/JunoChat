from game.stats import Stats
from game.npc import NPC

def main():
    stats = Stats({"Strength": 2, "Constitution": 4, "Dexterity": 1})
    npc = NPC(100, 50, 40, stats)

    print("Initial HP:", npc.get_health())
    npc.change_health(-10)
    print("After damage:", npc.get_health())

    stats.add_temporary("Strength", {"Value": 3, "Turns": 2})
    print("Temporary Strength:", stats.get_temporary("Strength"))

    stats.decrease_duration()
    print("After 1 turn:", stats.temporaries)

if __name__ == "__main__":
    main()
