from .stats import Stats
from collections import defaultdict
from typing import Dict, List

class Statsheet:
    def __init__(self, permanents: Dict[str, int] = None, temporaries: Dict[str, List[dict]] = None):
        self.permanent_stats = {stat: 0 for stat in Stats.PERMANENT_VALUES}
        if permanents:
            self.permanent_stats.update(permanents)
        
        # Temporaries still use string names for flexibility (buffs/debuffs can be named anything)
        self.temporary_stats = defaultdict(list, temporaries or {})
    
    def get_permanent(self, stat: str) -> int:
        """Returns the value of a permanent stat with given name."""
        return self.permanent_stats[stat]
    
    def get_temporary(self, stat: str) -> int:
        """Returns the total value of a temporary stat with given name."""
        return sum(effect["Value"] for effect in self.temporary_stats.get(stat, []))

    def get_permanent_and_temporary(self, stat: str) -> int:
        """Returns the total value of a stat, including both permanent and temporary effects."""
        return self.get_temporary(stat)+self.get_permanent(stat)

    def add_temporary(self, stat: str, value: int, turns: int | None = None, source: str | None = None):
        """Adds a temporary or persistent effect."""
        effect = {"Value": value}
        if turns is not None:
            effect["Turns"] = turns
        if source is not None:
            effect["Source"] = source
        self.temporary_stats[stat].append(effect)
    
    def update_permanent(self, stat: str, value: int):
        """Updates a permanent stat by adding value."""
        self.permanent_stats[stat] += value
        return self.permanent_stats
    
    def update_duration(self):
        """Updates the durations of temporary effects, removing those that have expired. A turn is passed."""
        updated = {}
        for stat, effects in self.temporary_stats.items():
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
        self.temporary_stats = defaultdict(list, updated)
    
    def remove_source(self, source: str):
        """Removes all effects created by a specified source."""
        for stat in list(self.temporary_stats.keys()):
            filtered = [e for e in self.temporary_stats[stat] if e.get("Source") != source]
            if filtered:
                self.temporary_stats[stat] = filtered
            else:
                del self.temporary_stats[stat]