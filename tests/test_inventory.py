from game.item_types import ItemType, ItemSubType
from game.item import Item
from game.inventory import Inventory

def create_test_sword():
    return Item("Test Sword", ItemType.WEAPON, ItemSubType.WeaponType.SWORD, "Right_Hand", {"damage": 5})

def create_test_helmet():
    return Item("Test Helmet", ItemType.ARMOR, ItemSubType.ArmorType.HELMET, "Head", {"defense": 3})

def test_inventory_init():
    inv = Inventory()
    assert len(inv.items) == 0
    assert inv.capacity == 30
    assert all(slot is None for slot in inv.equipped_items.values())

def test_add_item():
    inv = Inventory()
    sword = create_test_sword()
    added_item = inv.add_item(sword)
    assert added_item == sword
    assert sword in inv.items
    assert len(inv.items) == 1

def test_remove_item():
    inv = Inventory()
    sword = create_test_sword()
    inv.add_item(sword)
    removed_item = inv.remove_item(sword)
    assert removed_item == sword
    assert sword not in inv.items
    assert len(inv.items) == 0

def test_inventory_capacity():
    small_inv = Inventory(capacity=1)
    sword1 = Item("Sword1", ItemType.WEAPON, ItemSubType.WeaponType.SWORD, "Right_Hand")
    sword2 = Item("Sword2", ItemType.WEAPON, ItemSubType.WeaponType.SWORD, "Right_Hand")
    
    assert small_inv.add_item(sword1) == sword1
    assert small_inv.add_item(sword2) is None

def test_equip_item():
    inv = Inventory()
    helmet = create_test_helmet()
    inv.add_item(helmet)
    equipped = inv.equip_item(helmet)
    assert equipped == helmet
    assert inv.equipped_items["Head"] == helmet

def test_equip_invalid_slot():
    inv = Inventory()
    invalid_item = Item("Invalid", ItemType.MISC, slot="InvalidSlot")
    inv.add_item(invalid_item)
    assert inv.equip_item(invalid_item) is None

def test_equip_without_slot():
    inv = Inventory()
    no_slot_item = Item("NoSlot", ItemType.MISC)
    inv.add_item(no_slot_item)
    assert inv.equip_item(no_slot_item) is None

def test_unequip_item():
    inv = Inventory()
    helmet = create_test_helmet()
    inv.add_item(helmet)
    inv.equip_item(helmet)
    unequipped = inv.unequip_item("Head")
    assert unequipped == helmet
    assert inv.equipped_items["Head"] is None

def test_has_item():
    inv = Inventory()
    sword = create_test_sword()
    assert not inv.has_item(sword)
    inv.add_item(sword)
    assert inv.has_item(sword)

def test_is_equipped():
    inv = Inventory()
    helmet = create_test_helmet()
    inv.add_item(helmet)
    assert not inv.is_equipped(helmet)
    inv.equip_item(helmet)
    assert inv.is_equipped(helmet)

def test_list_items():
    inv = Inventory()
    sword = create_test_sword()
    helmet = create_test_helmet()
    inv.add_item(sword)
    inv.add_item(helmet)
    item_list = inv.list_items()
    assert "Test Sword" in item_list
    assert "Test Helmet" in item_list
    assert len(item_list) == 2

def test_get_equipped_items():
    inv = Inventory()
    helmet = create_test_helmet()
    inv.add_item(helmet)
    inv.equip_item(helmet)
    equipped = inv.get_equipped_items()
    assert equipped["Head"] == helmet
    assert equipped["Right_Hand"] is None

def run_all_tests():
    test_functions = [
        test_inventory_init,
        test_add_item,
        test_remove_item,
        test_inventory_capacity,
        test_equip_item,
        test_equip_invalid_slot,
        test_equip_without_slot,
        test_unequip_item,
        test_has_item,
        test_is_equipped,
        test_list_items,
        test_get_equipped_items
    ]
    
    for test in test_functions:
        try:
            test()
            print(f"✓ {test.__name__} passed")
        except AssertionError as e:
            print(f"✗ {test.__name__} failed: {str(e)}")
        except Exception as e:
            print(f"✗ {test.__name__} failed with error: {str(e)}")

if __name__ == "__main__":
    run_all_tests()

# python -m tests.test_inventory