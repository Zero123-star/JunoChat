from .statsheet import Statsheet
import random
class formulas : 
    @staticmethod
    def fireball_damage( stats : Statsheet):
        damage = 20 + stats.get_permanent_and_temporary("WISDOM")
        variated_damage = random.randint(int(damage * 0.9), int(damage * 1.1))
        return variated_damage
    @staticmethod
    def cleave_damage( stats : Statsheet):
        damage = 15 + stats.get_permanent_and_temporary("STRENGTH")
        variated_damage = random.randint(int(damage * 0.9), int(damage * 1.1))
        return variated_damage
    @staticmethod
    def base_formula(stats : Statsheet):
        return 30
class Ability:
    def __init__(self, name="missing", damageformula=formulas.base_formula, cost=0, cost_type="stamina"):
        self.name=name
        self.formula=damageformula
        self.cost=cost
        self.cost_type=cost_type
    def get_damage(self, stats):
        return self.formula(stats)
    def get_name(self):
        return self.name
    def get_cost(self):
        return self.cost
    def get_cost_type(self):
        return self.cost_type
