from .stats import Stats

class NPC:
    _id_counter = 0

    def __init__(self, hp: int, mana: int, stamina: int, stats: Stats):
        
        self.id = NPC._id_counter
        NPC._id_counter += 1
        
        self.hp = hp
        self.mana = mana
        self.stamina = stamina
        self.stats = stats

    def get_id(self):
        return self.id
    
    def get_health(self):
        return self.hp

    def get_mana(self):
        return self.mana

    def get_stamina(self):
        return self.stamina
    
    def get_stats(self):
        return self.stats

    def change_health(self, value: int):
        self.hp += value
        return self.hp

    def change_mana(self, value: int):
        self.mana += value
        return self.mana

    def change_stamina(self, value: int):
        self.stamina += value
        return self.stamina
