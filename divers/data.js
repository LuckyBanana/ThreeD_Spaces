
var content = {
    "packs": {
        "f0d911c7-4feb-4676-b324-84ec1cada6ed": {
            "settings": {"physics": {"gravity": [0.0, -9.8, 0.0]}, "render": {"fog_end": 1000.0, "fog_start": 1.0, "global_ambient": [0.2, 0.2, 0.2], "fog_color": [0.0, 0.0, 0.0], "fog": "none", "fog_density": 0.01}},
            "hierarchy": {
                "resource_id": "pack0",
                "name": "Test",
                "parent": null,
                "children": [
				{"scale": [1, 1, 1], "name": "Camera", "parent": "pack0", "resource_id": "cam0", "labels": [], "components": {"camera": {"fov": 45.0, "activate": true, "projection": 0.0, "clearColor": [0.729411780834198, 0.729411780834198, 0.6941176652908325, 1.0], "orthoHeight": 100.0, "farClip": 1000.0, "nearClip": 0.3}}, "position": [0, 0, 5], "rotation": [0, 0, 0], "children": [], "template": null},
				{"scale": [1, 1, 1], "name": "Directional Light", "parent": "pack0", "resource_id": "light0", "labels": [], "components": {"light": {"enable": true, "color": [1.0, 1.0, 1.0], "shadowResolution": 1024.0, "outerConeAngle": 45.0, "range": 10.0, "castShadows": false, "intensity": 1.0, "innerConeAngle": 40.0, "type": "directional"}}, "position": [0, 0, 0], "rotation": [45, -30, 0], "children": [], "template": null},
				{"scale": [1, 1, 1], "name": "Cube0", "parent": "pack0", "resource_id": "box0", "labels": [], "components": {"model": {"materialAsset": null, "receiveShadows": true, "type": "box", "asset": null, "castShadows": false}, "script": {"scripts": [{"url": "spinner.js", "attributes": [], "name": ""}]}}, "position": [-1, -1, -6], "rotation": [0, 0, 0], "children": [], "template": null},
				{"scale": [1, 1, 1], "name": "Ball0", "parent": "pack0", "resource_id": "sphere0", "labels": [], "components": {"model": {"materialAsset": null, "receiveShadows": true, "type": "sphere", "asset": null, "castShadows": false}, "script": {"scripts": [{"url": "spinner.js", "attributes": [], "name": ""}]}}, "position": [0, 0, 0], "rotation": [0, 0, 0], "children": [], "template": null}
				],
                "labels": [],
                "position": [0, 0, 0],
                "rotation": [0, 0, 0],
                "scale": [1, 1, 1],
                "components": {"pack": {}}
            }
        }
    },
    "application_properties": {
        "resolution_mode": "FIXED",
        "fill_mode": "KEEP_ASPECT",
        "width": 1280,
        "height": 720,
        "engine_version": "stable",
        "libraries": []
    },
    toc: {
    "default": {
        "assets": {},
        "packs": [
            "f0d911c7-4feb-4676-b324-84ec1cada6ed"
        ]
    }
}
};
pc.content = new pc.fw.ContentFile(content);