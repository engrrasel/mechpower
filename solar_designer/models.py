from django.db import models

class ApplianceCategory(models.Model):
    name = models.CharField(max_length=100, verbose_name="Category Name")
    slug = models.SlugField(unique=True)
    # Image upload field instead of emoji
    icon_image = models.ImageField(upload_to='category_icons/', blank=True, null=True, verbose_name="Icon Image")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Appliance Category"
        verbose_name_plural = "Appliance Categories"

class Appliance(models.Model):
    category = models.ForeignKey(ApplianceCategory, on_delete=models.CASCADE, related_name='appliances')
    name = models.CharField(max_length=100, verbose_name="Appliance Name (e.g., LED Bulb, Ceiling Fan)")
    icon_image = models.ImageField(upload_to='images/icons/', blank=True, null=True, verbose_name="Upload Icon Image")
    
    def __str__(self):
        return f"{self.name} ({self.category.name})"

class ApplianceVariant(models.Model):
    appliance = models.ForeignKey(Appliance, on_delete=models.CASCADE, related_name='variants')
    variant_name = models.CharField(max_length=100, help_text="e.g., 1 Ton, 1.5 Ton, 9 Watt")
    default_watt = models.PositiveIntegerField(help_text="Default power consumption in Watts")
    
    # Dynamic field to set default hours from the admin panel
    default_hours = models.FloatField(default=6.0, help_text="Default daily usage time in hours, e.g., 6.0, 4.5")
    
    is_default = models.BooleanField(default=False, verbose_name="Show this Variant as Default")

    def __str__(self):
        return f"{self.appliance.name} - {self.variant_name} ({self.default_watt}W - {self.default_hours} Hours)"