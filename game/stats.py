from collections import defaultdict
from typing import Dict, List

class Stats:
    def __init__(self, permanents: Dict[str, int], temporaries: Dict[str, List[dict]] = None):
        # Permanents are represented by a dictionary of stat name to value
        # Temporaries are represented by a dictionary of stat name to a list of differing values and turns
        # Permanents example: {"Strength": 2, "Constitution": 4, "Dexterity": 1}
        # Temporaries example: {"Strength Up": [{"Value": 3, "Turns": 2}, {"Value": 5, "Turns": 1}], "Dexterity Boost": [{"Value": 1, "Turns": 3}, {"Value": 2, "Turns": 2}]}
        self.permanents = permanents
        self.temporaries = defaultdict(list, temporaries or {})

    def get_permanent(self, stat: str) -> int:
        # Returns the value of a permanent stat with given name
        return self.permanents.get(stat, 0)

    def get_temporary(self, stat: str) -> int:
        # Returns the total value of a temporary stat with given name
        return sum(effect["Value"] for effect in self.temporaries.get(stat, []))

    def add_temporary(self, stat: str, value: int, turns: int | None = None, source: str | None = None):
        # Adds a temporary or persistent effect depending on turns
        effect = {"Value": value}
        if turns is not None:
            effect["Turns"] = turns
        if source is not None:
            effect["Source"] = source
        self.temporaries[stat].append(effect)
        
    def update_permanent(self, stat: str, value: int):
        self.permanents[stat] = self.permanents.get(stat, 0) + value
        return self.permanents

    def update_duration(self):
        # Decreases the duration of temporary stats, then removes expired temporary stats
        updated = {}
        for stat, effects in self.temporaries.items():
            remaining = []
            for e in effects:
                # Temporary Effects without "Turns" are given by items.
                if "Turns" not in e:
                    remaining.append(e)
                elif e["Turns"] > 1:
                    remaining.append({"Value": e["Value"], "Turns": e["Turns"] - 1, "Source": e.get("Source")})
            # Keep updated effects that did not expire    
            if remaining:
                updated[stat] = remaining
        self.temporaries = defaultdict(list, updated)
        
        
    def remove_source(self, source: str):
        # Removes all effects created by a specified source
        for stat, effects in list(self.temporaries.items()):
            filtered = [e for e in effects if e.get("Source") != source]
            if filtered:
                self.temporaries[stat] = filtered
            else:
                del self.temporaries[stat]
