from django.db import models

class Appliance(models.Model):
    CATEGORY_CHOICES = [
        ('residential', 'Residential'),
        ('industrial', 'Industrial'),
    ]
    
    name = models.CharField(max_length=100, verbose_name="Appliance Name")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='residential')
    icon_image = models.ImageField(upload_to='images/icons/', blank=True, null=True, verbose_name="Upload Icon Image")
    
    # এখান থেকে is_default বাদ দেওয়া হয়েছে

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

class ApplianceVariant(models.Model):
    appliance = models.ForeignKey(Appliance, on_delete=models.CASCADE, related_name='variants')
    variant_name = models.CharField(max_length=100, help_text="e.g., 1 Ton, 1.5 Ton, 1 HP, 20 Watt")
    default_watt = models.PositiveIntegerField(help_text="Default power consumption in Watts")
    
    # এখানে is_default যোগ করা হলো যাতে প্রতিটি ভ্যারিয়েন্ট আলাদাভাবে ডিফল্ট করা যায়
    is_default = models.BooleanField(default=False, verbose_name="Show this Variant as Default")

    def __str__(self):
        return f"{self.appliance.name} - {self.variant_name} ({self.default_watt}W)"