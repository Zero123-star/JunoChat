from enum import Enum, auto

class ItemType(Enum):
    WEAPON = auto()
    ARMOR = auto()
    POTION = auto()
    MISC = auto()
    
class ItemSubType:
    class WeaponType(Enum):
        SWORD = auto()
        BOW = auto()
        STAFF = auto()
        SHIELD = auto()
        
    class ArmorType(Enum):
        HELMET = auto()
        CHESTPLATE = auto()
        LEGGINGS = auto()
        BOOTS = auto()
        
    class StaffType(Enum):
        FIRE = auto()
        ICE = auto()
        LIGHTNING = auto()
        
    class PotionType(Enum):
        HEALING = auto()
        MANA = auto()
        STRENGTH = auto()