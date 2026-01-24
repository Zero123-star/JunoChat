from .statsheet import Statsheet
class formulas : 
    @staticmethod
    def fireball_damage( stats : Statsheet):
        return 20 + stats.get_permanent_and_temporary("WISDOM")
    @staticmethod
    def cleave_damage( stats : Statsheet):
        return 20 + stats.get_permanent_and_temporary("STRENGTH")
    @staticmethod
    def base_formula(stats : Statsheet):
        return 30
class Ability:
    def __init__(self, name="missing", damageformula=formulas.base_formula):
        self.name=name
        self.formula=damageformula
    def get_damage(self, stats):
        return self.formula(stats)
    def get_name(self):
        return self.name
    
