from .stats import Stats
from collections import defaultdict
from typing import Dict, List

class Statsheet:
    def __init__(self, permanents: Dict[Stats, int] = None, temporaries: Dict[str, List[dict]] = None):
        # Permanents now use Stats as keys, initialize all stats to 0
        self.permanents = {stat: 0 for stat in Stats}
        if permanents:
            self.permanents.update(permanents)
        
        # Temporaries still use string names for flexibility (buffs/debuffs can be named anything)
        self.temporaries = defaultdict(list, temporaries or {})
    
    def get_permanent(self, stat: Stats) -> int:
        # Returns the value of a permanent stat
        return self.permanents[stat]
    
    def get_temporary(self, stat: str) -> int:
        # Returns the total value of a temporary stat with given name
        return sum(effect["Value"] for effect in self.temporaries.get(stat, []))
    
    def add_temporary(self, stat: str, value: int, turns: int | None = None, source: str | None = None):
        # Adds a temporary or persistent effect
        effect = {"Value": value}
        if turns is not None:
            effect["Turns"] = turns
        if source is not None:
            effect["Source"] = source
        self.temporaries[stat].append(effect)
    
    def update_permanent(self, stat: Stats, value: int):
        # Updates a permanent stat by adding value
        self.permanents[stat] += value
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
                    new_effect = {"Value": e["Value"], "Turns": e["Turns"] - 1}
                    if "Source" in e:
                        new_effect["Source"] = e["Source"]
                    remaining.append(new_effect)
            # Keep updated effects that did not expire    
            if remaining:
                updated[stat] = remaining
        self.temporaries = defaultdict(list, updated)
    
    def remove_source(self, source: str):
        # Removes all effects created by a specified source
        for stat in list(self.temporaries.keys()):
            filtered = [e for e in self.temporaries[stat] if e.get("Source") != source]
            if filtered:
                self.temporaries[stat] = filtered
            else:
                del self.temporaries[stat]