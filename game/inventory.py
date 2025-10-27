from .item import Item

class Inventory:
    def __init__(self):
        self.items = []
        self.equipped_items = dict
        ### Add debugging and try throw catch for when functions are called.
        # We will need when we will move to building the actual combat system
        # Also please add returns

    def add_item(self, item: Item): ### Return the added item
        self.items.append(item)

    def remove_item(self, item: Item): ##Return the removed item. We will probably need that when we use potions
        if item in self.items:
            self.items.remove(item)

    def has_item(self, item: Item) -> bool:
        return item in self.items

    def list_items(self):
        return [item.name for item in self.items]
    
    def equip_item(self, item: Item): ###Return the equipped item
        if item in self.items:
            self.equipped_items[item.slot] = item
            
    def unequip_item(self, slot: str): ### Return the unequiped item
        if slot in self.equipped_items:
            del self.equipped_items[slot] ####Does it return in the self.items? 



    def get_equipped_items(self):
        return self.equipped_items
    
    def is_equipped(self, item: Item) -> bool:
        return item in self.equipped_items.values()
    
    def __repr__(self) -> str:
        return f"Inventory(items={self.items}, equipped_items={self.equipped_items})"