import json
from django.shortcuts import render
from .models import ApplianceVariant

def home(request):
    variants = ApplianceVariant.objects.select_related('appliance', 'appliance__category').all()
    
    appliances_list = []
    for v in variants:
        if v.appliance.icon_image:
            icon_url = v.appliance.icon_image.url
        else:
            icon_url = '/static/solar_designer/images/default-icon.png'

        appliances_list.append({
            'id': v.id,
            'name': v.appliance.name,
            'category_name': v.appliance.category.name,
            'category_slug': v.appliance.category.slug,
            'category_emoji': v.appliance.category.icon_emoji,
            'variant_name': v.variant_name,
            'watt': v.default_watt,
            'hours': v.default_hours, # ডাটাবেস থেকে ডিফল্ট আওয়ার্স পাঠানো হচ্ছে
            'icon_url': icon_url,
            'is_default': v.is_default 
        })
    
    context = {
        'appliances_json': json.dumps(appliances_list)
    }
    return render(request, "solar_designer/solar-designer.html", context)