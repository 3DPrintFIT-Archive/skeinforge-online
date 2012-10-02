G28 X0  ; home X axis
G1 Y170 F4000
M104 S0                   ; turn off extruder
M140 S0                   ; turn off bed
G92 E0			; reset extruder position
M84                          ; shut down motors.
