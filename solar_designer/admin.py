from django.contrib import admin
from .models import ApplianceCategory, Appliance, ApplianceVariant

# ১. ক্যাটাগরি ম্যানেজমেন্ট এডমিন
@admin.register(ApplianceCategory)
class ApplianceCategoryAdmin(admin.ModelAdmin):
    # এডমিন লিস্ট ভিউতে যা যা কলাম শো করবে
    list_display = ('id', 'name', 'slug', 'icon_emoji')
    
    # সার্চ করার সুবিধা (নাম এবং স্ল্যাগ দিয়ে)
    search_fields = ('name', 'slug')
    
    # নাম (বাংলা/ইংরেজি) টাইপ করলে স্ল্যাগটি যাতে অটোমেটিক ফিল হয়ে যায়
    prepopulated_fields = {'slug': ('name',)}
    
    # ইন্টারফেস সুন্দর করার জন্য ফিল্ডসেট গ্রুপিং
    fieldsets = (
        ('ক্যাটাগরি ইনফো', {
            'fields': ('name', 'slug')
        }),
        ('ডিসপ্লে এবং ডিজাইন', {
            'fields': ('icon_emoji',),
            'description': 'UI-তে অ্যাকর্ডিয়ন হেডার আইকন হিসেবে এই ইমোজিটি শো করবে। (যেমন: 💡, 🌀, ❄️)'
        }),
    )


# ২. অ্যাপ্লায়েন্সের ভেতরেই যাতে এক ক্লিকে ভ্যারিয়েন্ট অ্যাড করা যায় (Inline Form)
class ApplianceVariantInline(admin.TabularInline):
    model = ApplianceVariant
    extra = 1  # ডিফল্টভাবে ১টি ফাঁকা ভ্যারিয়েন্ট ইনপুট বক্স সবসময় রেডি থাকবে
    fields = ('variant_name', 'default_watt', 'default_hours', 'is_default')
    verbose_name = "ভ্যারিয়েন্ট"
    verbose_name_plural = "ভ্যারিয়েন্ট সমূহ"


# ৩. অ্যাপ্লায়েন্স ম্যানেজমেন্ট এডমিন
@admin.register(Appliance)
class ApplianceAdmin(admin.ModelAdmin):
    # এডমিন লিস্ট ভিউ কনফিগারেশন
    list_display = ('id', 'name', 'get_category_name')
    
    # ডানপাশে ফিল্টারিং অপশন (ক্যাটাগরি অনুযায়ী ফিল্টার করা যাবে)
    list_filter = ('category',)
    
    # অ্যাপ্লায়েন্সের নাম ধরে সার্চ করার সুবিধা
    search_fields = ('name',)
    
    # ইনলাইন ফর্মটি এখানে যুক্ত করা হলো
    inlines = [ApplianceVariantInline]

    # কাস্টম মেথড: লিস্টে ক্যাটাগরির নাম সুন্দরভাবে দেখানোর জন্য
    @admin.display(ordering='category__name', description='ক্যাটাগরি')
    def get_category_name(self, obj):
        return f"{obj.category.icon_emoji} {obj.category.name}"