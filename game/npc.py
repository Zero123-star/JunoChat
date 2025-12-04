from .inventory import Item, Inventory
from .moveset import Ability, Moveset
from .statsheet import Stats, Statsheet

class NPC:
    _id_counter = 0

    def __init__(self, hp: int, mana: int, stamina: int, inventory: Inventory, moveset: Moveset, stats: Statsheet):
        
        self.id = NPC._id_counter
        NPC._id_counter += 1
        
        self.hp = hp
        self.mana = mana
        self.stamina = stamina
        self.inventory = inventory
        self.moveset = moveset
        self.stats = stats

    def get_id(self):
        return self.id
    
    def get_health(self):
        return self.hp

    def get_mana(self):
        return self.mana

    def get_stamina(self):
        return self.stamina
    
    def get_inventory(self):
        return self.inventory
    
    def get_moveset(self):
        return self.moveset
    
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
    
    def give_item(self, item: Item):
        return self.inventory.add_item(item)
    
    def discard_item(self, item: Item):
        return self.inventory.remove_item(item)
    
    def check_in_inventory(self, item: Item):
        return self.inventory.has_item(item)
    
    def check_equipped(self, item:Item):
        return self.inventory.is_equipped(item)
    
    def check_inventory(self):
        return self.inventory.list_items()
    
    def check_equipped_items(self):
        return self.inventory.get_equipped_items()
    
    def equip(self, item:Item):
        return self.inventory.equip_item(item)
    
    def unequip(self, item:Item):
        return self.inventory.unequip_item(item)
    
    def learn_ability(self, ability: Ability):
        return self.moveset.add_ability(ability)

    def unlearn_ability(self, name: str):
        return self.moveset.remove_ability(name)

    def has_ability(self, name: str):
        return self.moveset.is_learnt(name)

    def list_abilities(self):
        return self.moveset.list_abilities()
    
    def use_ability(self, name):
        ability_type, ability_pow, ability_cost = self.moveset.get_ability(name)
        match ability_type:
            case 'PHYSICAL':
                if ability_cost > self.stamina:
                    return 0
            case 'MAGIC':
                if ability_cost > self.mana:
                    return 0
            case _:
                return 0
        return 1
            
    def get_permanent_stat(self, stat: Stats) -> int:
        return self.stats.get_permanent(stat)

    def get_temporary_stat(self, stat_name: str) -> int:
        return self.stats.get_temporary(stat_name)

    def add_temporary_stat(self, stat_name: str, value: int, turns: int | None = None, source: str | None = None):
        self.stats.add_temporary(stat_name, value, turns, source)

    def update_stat(self, stat: Stats, value: int):
        return self.stats.update_permanent(stat, value)

    def update_stat_durations(self):
        self.stats.update_duration()

    def remove_stat_source(self, source: str):
        self.stats.remove_source(source)