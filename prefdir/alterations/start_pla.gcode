G92 E0	; reset extruder position

M109 S185 ; set extruder temperature and wait

G28	; home all axes
G1 F3000
G1 X90 Y90 Z10	; move to center

M190 S60 ; set bed temperature and wait

