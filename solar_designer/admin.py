from django.contrib import admin
from .models import Appliance, ApplianceVariant

class ApplianceVariantInline(admin.TabularInline):
    model = ApplianceVariant
    extra = 1 # ডিফল্টভাবে ১টি ফাঁকা রো দেখাবে আরও ভ্যারিয়েন্ট যোগ করার জন্য

@admin.register(Appliance)
class ApplianceAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    list_filter = ('category',)
    search_fields = ('name',)
    inlines = [ApplianceVariantInline]