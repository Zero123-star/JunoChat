class Ability:
    def __init__(self, name, description, type, power, cost):
        self.name = name
        self.description = description
        self.type = type
        self.power = power
        self.cost = cost
        
    def get_name(self):
        return self.name
    
    def get_description(self):
        return self.description
    
    def get_type(self):
        return self.type
    
    def get_power(self):
        return self.power
    
    def get_cost(self):
        return self.cost
    
    def update_description(self, new_description):
        self.description = new_description
    
    def update_cost(self, new_cost):
        self.cost = new_cost
        
    def __repr__(self) -> str:
        return f"{self.name}, {self.description}, Power = {self.power}, Cost = {self.cost}"