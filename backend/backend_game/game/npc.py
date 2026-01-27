from .inventory import Item, Inventory
from .moveset import Ability, Moveset
from .statsheet import Stats, Statsheet

class NPC:
    _id_counter = 0

    def __init__(self, hp: int, mana: int, stamina: int, inventory: Inventory, moveset: Moveset, stats: Statsheet):
        
        self.id = NPC._id_counter
        NPC._id_counter += 1
        
        self.hp = hp
        self.max_hp = hp
        self.mana = mana
        self.max_mana = mana
        self.stamina = stamina
        self.max_stamina = stamina
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

    def restore_health(self,value = 0):
        self.hp = min(self.max_hp, self.hp + value)
        return self.hp
    def restore_mana(self,value = 0):
        self.mana = min(self.max_mana, self.mana + value)
        return self.mana
    def restore_stamina(self,value = 0):
        self.stamina = min(self.max_stamina, self.stamina + value)
        return self.stamina


    def change_health(self, value_added: int):
        self.hp += value_added
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
    

    #Equips the item, and adding its stats to the statsheet
    def equip(self, item:Item):
        equipped_item=self.inventory.equip_item(item)
        if equipped_item != None :
            for stat_dict in equipped_item.stats:
                stat_name=stat_dict.get("Type")
                stat_value=stat_dict.get("Value")
                stat_turn_duration=stat_dict.get("Turns")
                self.stats.add_temporary(stat=stat_name,value=stat_value,
                                         turns=stat_turn_duration,source=equipped_item.name)
            return equipped_item
        print("(npc)Unable to equip item!")
        return None

    #Unequips the item, removes its stats from the statsheet 
    def unequip(self, item:Item):
        """Unequips an item and removes its stat effects from the statsheet."""
        unequipped_item=self.inventory.unequip_item(item)
        if unequipped_item != None : 
            self.stats.remove_source(unequipped_item.name)
            return unequipped_item
        print("(npc)Error at unequipping item!")
        return None
    
    def learn_ability(self, ability: Ability):
        """Learns a new ability and adds it to the moveset."""
        return self.moveset.add_ability(ability)

    def unlearn_ability(self, name: str):
        return self.moveset.remove_ability(name)

    def has_ability(self, name: str):
        return self.moveset.is_learnt(name)

    def list_abilities(self):
        return self.moveset.list_abilities()
    
    #@returns damage dealt
    def use_ability(self, name):
        """Uses an ability from the moveset and returns the damage dealt."""
        if(self.has_ability(name)):
            return self.moveset.get_ability(name).get_damage(self.stats)
        print("(NPC_use_ability): Error, ability not found")
        return None