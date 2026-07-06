from django.db import models

class ApplianceCategory(models.Model):
    name = models.CharField(max_length=100, verbose_name="Category Name (যেমন: লাইট, ফ্যান)")
    slug = models.SlugField(max_length=100, unique=True, help_text="ইংরেজিতে ইউনিক কোড (যেমন: lighting, fan, ac)")
    icon_emoji = models.CharField(max_length=10, default="🔌", help_text="UI এর জন্য একটি ইমোজি দিন (যেমন: 💡, 🌀, ❄️)")

    def __str__(self):
        return self.name

class Appliance(models.Model):
    category = models.ForeignKey(ApplianceCategory, on_delete=models.CASCADE, related_name='appliances')
    name = models.CharField(max_length=100, verbose_name="Appliance Name (যেমন: LED Bulb, Ceiling Fan)")
    icon_image = models.ImageField(upload_to='images/icons/', blank=True, null=True, verbose_name="Upload Icon Image")
    
    def __str__(self):
        return f"{self.name} ({self.category.name})"

class ApplianceVariant(models.Model):
    appliance = models.ForeignKey(Appliance, on_delete=models.CASCADE, related_name='variants')
    variant_name = models.CharField(max_length=100, help_text="e.g., 1 Ton, 1.5 Ton, 9 Watt")
    default_watt = models.PositiveIntegerField(help_text="Default power consumption in Watts")
    
    # অ্যাডমিন প্যানেল থেকে ডিফল্ট টাইম (ঘণ্টা) সেট করার নতুন ফিল্ড
    default_hours = models.FloatField(default=6.0, help_text="দৈনিক ডিফল্ট ব্যবহারের সময় (ঘণ্টায়), যেমন: 6, 4.5")
    
    is_default = models.BooleanField(default=False, verbose_name="Show this Variant as Default")

    def __str__(self):
        return f"{self.appliance.name} - {self.variant_name} ({self.default_watt}W - {self.default_hours} Hours)"