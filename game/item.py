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
        
    def get_name(self) -> str:
        return self.name
    
    def get_type(self) -> ItemType:
        return self.type
    
    def get_subtype(self) -> WeaponType | ArmorType | StaffType | None:
        return self.subtype
    
    def __repr__(self) -> str:
        return f"Item(name={self.name}, type={self.type}, subtype={self.subtype})"