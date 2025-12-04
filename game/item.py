from . import item_types as it

class Item:
    def __init__(self, name: str, type: it.ItemType, subtype: it.ItemSubType | None = None, slot: str | None = None, stats: dict | None = None, description : str | None = None):
        self.name = name
        self.type = type
        self.subtype = subtype
        self.slot= slot
        self.stats= stats or {}
        self.description = description or ""

    def get_name(self) -> str:
        return self.name
    
    def get_type(self) -> it.ItemType:
        return self.type

    def get_subtype(self) -> it.ItemSubType | None:
        return self.subtype
    
    def get_slot(self) -> str | None:
        return self.slot
    
    def get_stats(self) -> dict:
        return self.stats

    def get_description(self) -> str:
        return self.description
    
    def update_name(self, new_name: str):
        self.name = new_name
        return self.name
    
    def update_type(self, new_type: it.ItemType):
        self.type = new_type
        return self.type
    
    def update_subtype(self, new_subtype: it.ItemSubType):
        self.subtype = new_subtype
        return self.subtype
    
    def update_slot(self, new_slot: str):
        self.slot = new_slot
        return self.slot
    
    def update_stats(self, new_stats: dict):
        self.stats = new_stats
        return self.stats
    
    def update_description(self, new_description: str):
        self.description = new_description
        return self.description

    def __repr__(self) -> str:
        return f"Item(name={self.name}, type={self.type}, subtype={self.subtype})"