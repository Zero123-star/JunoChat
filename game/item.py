from enum import Enum, auto

class ItemType(Enum):
    WEAPON = auto()
    ARMOR = auto()
    POTION = auto()
    MISC = auto()

class WeaponType(Enum):
    SWORD = auto()
    BOW = auto()
    STAFF = auto()

class ArmorType(Enum):
    HELMET = auto()
    CHESTPLATE = auto()
    LEGGINGS = auto()
    BOOTS = auto()
    
class StaffType(Enum):
    FIRE = auto()
    ICE = auto()
    LIGHTNING = auto()


class Item:
    def __init__(self, name: str, type: ItemType, subtype: WeaponType | ArmorType | StaffType | None = None):
        self.name = name
        self.type = type
        self.subtype = subtype
        self.stats= dict
        ### self.slot 
        ### Items currently do not have slots


        ###Each item needs to have stats given to whoever equips them: defense, attack, dexterity, agility etc
        # Probably add an item description too
        # Make sure that items actually use slots
        #
        # Add a set of potion like items, healing potions, mana potions, buff potions, who don't equip a slot but will be used
        # Make sure stats of an item follow the format of a Stat in the stats.py class(healing/mana potions dont need to). 
        # Something like: 
        # item1: self.name=greatsword 
        #        self.type=WeaponType
        #        self.slot=(Left_hand,Righ_hand) ###Lets go with some items occupy more slots. 
        #        self.stats={"Attack" : 500}
        # item2: self.name=Plate_Armor
        #        self.type=WeaponType
        #        self.slot=(Chest) 
        #        self.stats={"Defense" : 500, "Agility" : -50} //Less agile from heavy armor
        
        
        # For stat class logic:
        # Armor/weapon type items would have fall into temporary_stats, but the value_and_time class should have a parameter 'permanent'
        # When a turn passes, if you have your armor/weapon equipped its remaining_turns value will not decrease
        # Since the item is equipped
        #
        #
        # Please add some item equipping removing tests too. Obviously using inventory class too
        # Thx


    def get_name(self) -> str:
        return self.name
    
    def get_type(self) -> ItemType:
        return self.type
    
    def get_subtype(self) -> WeaponType | ArmorType | StaffType | None:
        return self.subtype
    
    def __repr__(self) -> str:
        return f"Item(name={self.name}, type={self.type}, subtype={self.subtype})"