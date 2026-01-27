from game import *
import array 
import random
class combat:
    def __init__(self):
        self.Active_NpcList = [] # Will contain all the npcs, enemy,allied,pc
        self.Player_NPC = None # Will also be found in the Active_NpcList 
    def end_turn(self):
        pass
    def add_npc(self, npc_to_add : NPC):
        self.Active_NpcList.append(npc_to_add)
    def debug(self):
        for npc in self.Active_NpcList:
            npc : NPC
            print(npc.get_id())
    def create_dummy_npc(self):
        inventory=Inventory()
        statsheet=Statsheet()
        moveset=Moveset([])
        ability = Ability(name="Sword_Slash", damageformula=formulas.cleave_damage)
        moveset.add_ability(ability)
        npc = NPC(hp=100,mana=100,stamina=100,inventory=inventory,moveset=moveset,stats=statsheet)
        return npc 
    def npc1_attack_npc2(self, npc1: NPC, ability: Ability,  npc2 : NPC):
        if(npc1.has_ability(ability.get_name())):
            npc2.change_health(npc1.use_ability(ability.get_name())*-1)
            return npc2.get_health()
    def npc_calculate_damage(self, npc : NPC, damage, type = "physical") : 
        """Calculates the final damage dealt by an NPC after considering defenses and random variation. Returns the final damage value."""
        variated_damage = random.randint(int(damage * 0.8), int(damage * 1.2))
        if type == "physical" : 
            defense = npc.get_stats().get_permanent_and_temporary("CONSTITUTION")
        elif type == "magical" : 
            defense = npc.get_stats().get_permanent_and_temporary("WISDOM")
        else :
            defense = 0
        return max(variated_damage - defense, 0)
    def npc_end_turn(self, npc : NPC):
        """Ends the turn for a given NPC, applying any end-of-turn effects."""
        npc_stats : Statsheet
        npc_stats= npc.get_stats()
        npc_stats.update_duration()
        con=npc_stats.get_permanent_and_temporary("CONSTITUTION")
        intel=npc_stats.get_permanent_and_temporary("INTELLIGENCE")
        wis=npc_stats.get_permanent_and_temporary("WISDOM")
        npc.change_stamina(con*2)
        npc.change_health(con)
        npc.change_mana(intel*2 + wis)
    

def fight():
    npc1 : NPC 
    npc2 : NPC
    npc1=engine.Active_NpcList[0]
    npc2=engine.Active_NpcList[1]
    ability = Ability(name="Sword_Slash", damageformula=formulas.cleave_damage)
    engine.npc1_attack_npc2(npc1,ability,npc2)
    print(npc1.get_health(), npc2.get_health())



engine = combat()
for i in range(0,10):
    engine.add_npc(engine.create_dummy_npc())
fight()
print(engine.Active_NpcList[1].get_health())




    