from backend_game.game import *
import random

class CombatEngine:
    def __init__(self):
        self.active_npcs = []
        self.player_npc = None
    
    def add_npc(self, npc: NPC):
        self.active_npcs.append(npc)
        return npc
    
    def npc_calculate_damage(self, npc: NPC, damage, type="physical"):
        """Calculates final damage after defenses"""
        variated_damage = random.randint(int(damage * 0.8), int(damage * 1.2))
        if type == "physical":
            defense = npc.get_stats().get_permanent_and_temporary("CONSTITUTION")
        elif type == "magical":
            defense = npc.get_stats().get_permanent_and_temporary("WISDOM")
        else:
            defense = 0
        return max(variated_damage - defense, 0)
    
    def npc_end_turn(self, npc: NPC):
        """Ends turn for NPC, applying regeneration"""
        npc_stats = npc.get_stats()
        npc_stats.update_duration()
        con = npc_stats.get_permanent_and_temporary("CONSTITUTION")
        intel = npc_stats.get_permanent_and_temporary("INTELLIGENCE")
        wis = npc_stats.get_permanent_and_temporary("WISDOM")
        npc.restore_health(con * 2)
        npc.restore_mana(intel * 2 + wis)
        npc.restore_stamina(con * 2)