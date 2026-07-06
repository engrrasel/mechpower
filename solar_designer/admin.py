from django.contrib import admin
from django.utils.html import format_html
from .models import ApplianceCategory, Appliance, ApplianceVariant

@admin.register(ApplianceCategory)
class ApplianceCategoryAdmin(admin.ModelAdmin):
    # Displays fields in the admin list view
    list_display = ('id', 'name', 'slug', 'display_icon')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    
    fieldsets = (
        ('Category Info', {
            'fields': ('name', 'slug')
        }),
        ('Display & Design', {
            'fields': ('icon_image',),
            'description': 'This image will be displayed as the accordion header icon in the UI. (SVG or transparent PNG is preferred)'
        }),
    )

    # Image preview method for admin list
    @admin.display(description='Icon Preview')
    def display_icon(self, obj):
        if obj.icon_image:
            return format_html('<img src="{}" style="width: 30px; height: 30px; object-fit: contain;" />', obj.icon_image.url)
        return "No Icon"


# Inline form to add variants directly inside the Appliance form
class ApplianceVariantInline(admin.TabularInline):
    model = ApplianceVariant
    extra = 1  # One empty variant input box will always be ready by default
    fields = ('variant_name', 'default_watt', 'default_hours', 'is_default')
    verbose_name = "Variant"
    verbose_name_plural = "Variants"


# Appliance Management Admin Configuration
@admin.register(Appliance)
class ApplianceAdmin(admin.ModelAdmin):
    # Admin list view configuration
    list_display = ('id', 'name', 'get_category_name')
    
    # Right-side filtering options
    list_filter = ('category',)
    
    # Search functionality by appliance name
    search_fields = ('name',)
    
    # Inlining the variant form
    inlines = [ApplianceVariantInline]

    # Custom method to display category name along with its icon in the list view
    @admin.display(ordering='category__name', description='Category')
    def get_category_name(self, obj):
        # Updated from icon_emoji to icon_image to match your new model structure
        if obj.category and obj.category.icon_image:
            return format_html('<span style="display: flex; align-items: center; gap: 8px;"><img src="{}" style="width: 20px; height: 20px; object-fit: contain;" /> {}</span>', obj.category.icon_image.url, obj.category.name)
        return obj.category.name if obj.category else "No Category"