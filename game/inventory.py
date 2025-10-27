from .item import Item

class Inventory:
    def __init__(self):
        self.items = []
        self.equipped_items = dict

    def add_item(self, item: Item):
        self.items.append(item)

    def remove_item(self, item: Item):
        if item in self.items:
            self.items.remove(item)

    def has_item(self, item: Item) -> bool:
        return item in self.items

    def list_items(self):
        return [item.name for item in self.items]
    
    def equip_item(self, item: Item):
        if item in self.items:
            self.equipped_items[item.slot] = item
            
    def unequip_item(self, slot: str):
        if slot in self.equipped_items:
            del self.equipped_items[slot]
            
    def get_equipped_items(self):
        return self.equipped_items
    
    def is_equipped(self, item: Item) -> bool:
        return item in self.equipped_items.values()
    
    def __repr__(self) -> str:
        return f"Inventory(items={self.items}, equipped_items={self.equipped_items})"