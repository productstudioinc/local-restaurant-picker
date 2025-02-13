import { RootLayout } from "./components/RootLayout";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Restaurant {
  id: string;
  name: string;
  cuisineType: string;
  priceRange: 1 | 2 | 3 | 4;
  rating: 1 | 2 | 3 | 4 | 5;
  lastVisited?: string;
}

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [filters, setFilters] = useState({
    cuisineType: '',
    priceRange: 0,
    minRating: 0
  });
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    cuisineType: '',
    priceRange: 1,
    rating: 5
  });

  // Load restaurants from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('restaurants');
    if (saved) {
      setRestaurants(JSON.parse(saved));
    }
  }, []);

  // Save restaurants to localStorage
  useEffect(() => {
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
  }, [restaurants]);

  const addRestaurant = () => {
    if (!newRestaurant.name || !newRestaurant.cuisineType) {
      toast.error('Please fill in all fields');
      return;
    }

    const restaurant: Restaurant = {
      id: Date.now().toString(),
      ...newRestaurant
    };

    setRestaurants([...restaurants, restaurant]);
    setNewRestaurant({
      name: '',
      cuisineType: '',
      priceRange: 1,
      rating: 5
    });
    toast.success('Restaurant added!');
  };

  const pickRandom = () => {
    let filtered = [...restaurants];
    
    if (filters.cuisineType) {
      filtered = filtered.filter(r => r.cuisineType === filters.cuisineType);
    }
    if (filters.priceRange) {
      filtered = filtered.filter(r => r.priceRange <= filters.priceRange);
    }
    if (filters.minRating) {
      filtered = filtered.filter(r => r.rating >= filters.minRating);
    }

    if (filtered.length === 0) {
      toast.error('No restaurants match your filters');
      return;
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setSelectedRestaurant(random);
    toast.success('Restaurant selected!');
  };

  const updateRating = (restaurantId: string, newRating: number) => {
    setRestaurants(restaurants.map(r => 
      r.id === restaurantId 
        ? { ...r, rating: newRating as Restaurant['rating'], lastVisited: new Date().toISOString() }
        : r
    ));
    toast.success('Rating updated!');
  };

  return (
    <RootLayout>
      <div className="container mx-auto p-4 max-w-2xl">
        <Tabs defaultValue="list">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Restaurants</TabsTrigger>
            <TabsTrigger value="picker">Pick Random</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card className="p-4">
              <h2 className="text-lg font-bold mb-4">Add Restaurant</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newRestaurant.name}
                    onChange={e => setNewRestaurant({...newRestaurant, name: e.target.value})}
                    placeholder="Restaurant name"
                  />
                </div>
                <div>
                  <Label htmlFor="cuisine">Cuisine Type</Label>
                  <Input
                    id="cuisine"
                    value={newRestaurant.cuisineType}
                    onChange={e => setNewRestaurant({...newRestaurant, cuisineType: e.target.value})}
                    placeholder="e.g., Italian, Mexican, etc."
                  />
                </div>
                <div>
                  <Label>Price Range</Label>
                  <RadioGroup
                    value={newRestaurant.priceRange.toString()}
                    onValueChange={v => setNewRestaurant({...newRestaurant, priceRange: parseInt(v) as 1|2|3|4})}
                    className="flex space-x-4"
                  >
                    {[1,2,3,4].map(n => (
                      <div key={n} className="flex items-center space-x-2">
                        <RadioGroupItem value={n.toString()} id={`price-${n}`} />
                        <Label htmlFor={`price-${n}`}>{'$'.repeat(n)}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <Button onClick={addRestaurant}>Add Restaurant</Button>
              </div>
            </Card>

            <div className="space-y-4">
              {restaurants.map(restaurant => (
                <Card key={restaurant.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {restaurant.cuisineType} · {'$'.repeat(restaurant.priceRange)}
                      </p>
                    </div>
                    <RadioGroup
                      value={restaurant.rating.toString()}
                      onValueChange={v => updateRating(restaurant.id, parseInt(v))}
                      className="flex space-x-1"
                    >
                      {[1,2,3,4,5].map(n => (
                        <RadioGroupItem
                          key={n}
                          value={n.toString()}
                          id={`rating-${restaurant.id}-${n}`}
                          className="sr-only"
                        />
                      ))}
                    </RadioGroup>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="picker" className="space-y-4">
            <Card className="p-4">
              <h2 className="text-lg font-bold mb-4">Filters</h2>
              <div className="space-y-4">
                <div>
                  <Label>Cuisine Type</Label>
                  <Select
                    value={filters.cuisineType}
                    onValueChange={v => setFilters({...filters, cuisineType: v})}
                  >
                    <option value="">Any</option>
                    {[...new Set(restaurants.map(r => r.cuisineType))].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Max Price Range</Label>
                  <RadioGroup
                    value={filters.priceRange.toString()}
                    onValueChange={v => setFilters({...filters, priceRange: parseInt(v)})}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="price-any" />
                      <Label htmlFor="price-any">Any</Label>
                    </div>
                    {[1,2,3,4].map(n => (
                      <div key={n} className="flex items-center space-x-2">
                        <RadioGroupItem value={n.toString()} id={`filter-price-${n}`} />
                        <Label htmlFor={`filter-price-${n}`}>{'$'.repeat(n)}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <Button onClick={pickRandom} className="w-full">Pick Random Restaurant</Button>
              </div>
            </Card>

            {selectedRestaurant && (
              <Card className="p-4">
                <h2 className="text-xl font-bold mb-2">Selected Restaurant</h2>
                <div className="space-y-2">
                  <p className="text-2xl">{selectedRestaurant.name}</p>
                  <p className="text-muted-foreground">
                    {selectedRestaurant.cuisineType} · {'$'.repeat(selectedRestaurant.priceRange)}
                  </p>
                  <p>Rating: {selectedRestaurant.rating}/5</p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </RootLayout>
  );
}

export default App;