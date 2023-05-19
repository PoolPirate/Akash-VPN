export const deployyaml =
  '---\n' +
  'version: "2.0"\n' +
  '\n' +
  'services:\n' +
  '  softether:\n' +
  '    image: andrey01/softether:4.38-9760-2\n' +
  '    expose:\n' +
  '      - port: 80\n' +
  '        as: 80\n' +
  '        to:\n' +
  '          - global: true\n' +
  '      - port: 443\n' +
  '        as: 443\n' +
  '        to:\n' +
  '          - global: true\n' +
  '      - port: 992\n' +
  '        as: 992\n' +
  '        to:\n' +
  '          - global: true\n' +
  '      - port: 5555\n' +
  '        as: 5555\n' +
  '        to:\n' +
  '          - global: true\n' +
  '      - port: 1194\n' +
  '        as: 1194\n' +
  '        proto: udp\n' +
  '        to:\n' +
  '          - global: true\n' +
  '      - port: 500\n' +
  '        as: 500\n' +
  '        proto: udp\n' +
  '        to:\n' +
  '          - global: true\n' +
  '      - port: 4500\n' +
  '        as: 4500\n' +
  '        proto: udp\n' +
  '        to:\n' +
  '          - global: true\n' +
  '\n' +
  'profiles:\n' +
  '  compute:\n' +
  '    softether:\n' +
  '      resources:\n' +
  '        cpu:\n' +
  '          units: 1.0\n' +
  '        memory:\n' +
  '          size: 512Mi\n' +
  '        storage:\n' +
  '          size: 512Mi\n' +
  '  placement:\n' +
  '    akash:\n' +
  '      signedBy:\n' +
  '        anyOf:\n' +
  '          - "akash1365yvmc4s7awdyj3n2sav7xfx76adc6dnmlx63"\n' +
  '          - "akash18qa2a2ltfyvkyj0ggj3hkvuj6twzyumuaru9s4"\n' +
  '      pricing:\n' +
  '        softether:\n' +
  '          denom: uakt\n' +
  '          amount: 10000\n' +
  '\n' +
  'deployment:\n' +
  '  softether:\n' +
  '    akash:\n' +
  '      profile: softether\n' +
  '      count: 1';
