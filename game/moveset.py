from .ability import Ability
from typing import List

class Moveset:
    def __init__(self, abilities: List[Ability]):
        self.abilities: List[Ability] = abilities
        
    def add_ability(self, ability : Ability):
        self.abilities.append(ability)
        return ability
    
    def is_learnt(self, name):
        return any(a.get_name() == name for a in self.abilities)
    
    def remove_ability(self, name):
        if self.is_learnt(name) == False:
            return 0
        for ability in self.abilities:
            if ability.get_name() == name:
                self.abilities.remove(ability)
                return ability
    
    def list_abilities(self):
        return [a.get_name() for a in self.abilities]
        
    def get_ability(self, name):
        if self.is_learnt(name) == False:
            return 0    
        for ability in self.abilities:
            if ability.get_name() == name:
                type = ability.get_type()
                power = ability.get_power()
                cost = ability.get_cost()
                return type, power, cost
                    
    
    def __repr__(self) -> str:
        abilities_str = ", ".join(repr(ability) for ability in self.abilities)
        return f"Moveset: [{abilities_str}]"