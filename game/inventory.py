from .item import Item
#({"Strength" : 5, "Turns" : 3},{"Dexterity" : 5, "Turns" : 3})
class Inventory:
    def __init__(self, capacity : int = 30):
        self.capacity = capacity
        self.items = []
        self.equipped_items = {"Head": None, "Chest": None, "Left_Hand": None, "Right_Hand": None, "Legs": None, "Feet" : None}

    def add_item(self, item: Item):
        if len(self.items) >= self.capacity:
            print(f"[Inventory] Cannot add '{item.name}': inventory full!")
            return None
        self.items.append(item)
        return item

    def remove_item(self, item: Item):
        if item in self.items:
            self.items.remove(item)
            print(f"[Inventory] '{item.name}' discarded.")
            return item
        print(f"[Inventory] '{item.name} not in inventory!'")
        return None

    def has_item(self, item: Item) -> bool:
        return item in self.items

    def list_items(self):
        return [item.name for item in self.items]
    
    #Returns reference to equipped item if succesfull or none otherwise
    def equip_item(self, item: Item):
        # Check Inventory
        if item not in self.items:
            print(f"[Inventory] Cannot equip '{item.name}': item not in inventory!")
            return None

        # Slot Validation
        if not item.slot:
            print(f"[Inventory] Cannot equip '{item.name}': item has no slot assigned!")
            return None
        if item.slot not in self.equipped_items:
            print(f"[Inventory] Cannot equip '{item.name}': invalid slot '{item.slot}'!")
            return None
        if self.equipped_items[item.slot]:
            print(f"[Inventory] Cannot equip '{item.name}': slot '{item.slot}' is already taken!")
            return None

        # Equip
        self.equipped_items[item.slot] = item
        print(f"[Inventory] Equipped '{item.name}' in slot '{item.slot}'.")
        return item

    def unequip_item(self, slot: str):
        
        # Slot Validation
        if slot not in self.equipped_items:
            print(f"[Inventory] Cannot unequip: invalid slot '{slot}'.")
            return None
        item = self.equipped_items[slot]
        if not item:
            print(f"[Inventory] No item equipped in slot '{slot}'.")
            return None

        # Unequip
        self.equipped_items[slot] = None
        print(f"[Inventory] Unequipped '{item.name}' from slot '{slot}'.")
        return item

    def get_equipped_items(self):
        return self.equipped_items
    
    def is_equipped(self, item: Item) -> bool:
        return item in self.equipped_items.values()
    
    def __repr__(self) -> str:
        return f"Inventory(Items={self.items}, Equipped_items={self.equipped_items})"